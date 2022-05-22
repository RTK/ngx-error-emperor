import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick
} from '@angular/core/testing';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';

import {FormComponent} from './form.component';

import {FormError} from '../../classes/form-error/form-error.class';
import {FORM_CONTAINER} from '../../injection-tokens/form-container.injection-token';
import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import type {FormContainer} from '../../types/form-container.type';
import type {ErrorInterceptor} from '../../types/error-interceptor.type';
import {noError} from '../../values/no-error.value';

describe('FormComponent', (): void => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    let errorInterceptorList: readonly ErrorInterceptor[];
    let formContainer: FormContainer;
    let formGroup: FormGroup;

    beforeEach(async (): Promise<void> => {
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            providers: [
                {
                    provide: ERROR_INTERCEPTORS,
                    useValue: [
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor,
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor,
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor
                    ]
                },
                {
                    provide: FORM_CONTAINER,
                    useValue: {
                        submit: jest.fn()
                    } as FormContainer
                },
                {
                    provide: FormGroup,
                    useValue: new FormGroup({
                        a: new FormControl(),
                        b: new FormControl(),
                        c: new FormControl()
                    })
                }
            ]
        }).compileComponents();
    });

    beforeEach((): void => {
        errorInterceptorList = TestBed.inject(ERROR_INTERCEPTORS);
        formContainer = TestBed.inject(FORM_CONTAINER);
        formGroup = TestBed.inject(FormGroup);
    });

    beforeEach((): void => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
    });

    it('should create', (): void => {
        expect(component).toBeTruthy();
    });

    describe('onSubmit()', (): void => {
        it('should preventDefault and cancelBubble on event and wait for the formContainers submit method adequately', fakeAsync((): void => {
            const event: CustomEvent = new CustomEvent('test');

            const preventDefaultSpy: jest.SpyInstance = jest.spyOn(
                event,
                'preventDefault'
            );

            expect(event.cancelBubble).toBe(false);

            component.onSubmit(event);
            expect(preventDefaultSpy).toHaveBeenCalledWith();
            expect(event.cancelBubble).toBe(true);

            const subject: Subject<void> = new Subject();
            formContainer.submit = jest.fn((): Promise<void> => {
                return subject.pipe(first()).toPromise();
            });

            const promiseSpy: jest.Mock = jest.fn();
            component.onSubmit(event).then(promiseSpy);

            expect(promiseSpy).not.toHaveBeenCalled();
            subject.next();
            tick();
            expect(promiseSpy).toHaveBeenCalledWith(void 0);

            const observableSpy: jest.Mock = jest.fn();
            formContainer.submit = jest.fn((): Observable<void> => {
                return subject.pipe(first());
            });
            component.onSubmit(event).then(observableSpy);

            expect(observableSpy).not.toHaveBeenCalled();
            subject.next();
            tick();
            expect(observableSpy).toHaveBeenCalledWith(void 0);

            subject.complete();

            expect(component.error).toBe(noError);
            expect(component.hasError).toBe(false);
        }));

        it('should run errors through all interceptors and assign it as the form error, if it is no FormError instance', async (): Promise<void> => {
            const error: Error = new Error('test');

            formContainer.submit = (): never => {
                throw error;
            };

            await component.onSubmit(new CustomEvent('test'));

            expect(component.hasError).toBe(true);
            expect(component.error).toBe(error);
            expect(errorInterceptorList[0].handle).toHaveBeenCalledWith(error);
            expect(errorInterceptorList[1].handle).toHaveBeenCalledWith(error);
            expect(errorInterceptorList[2].handle).toHaveBeenCalledWith(error);

            expect(formGroup.errors).toBe(null);
            expect(formGroup.controls.a.errors).toBe(null);
            expect(formGroup.controls.b.errors).toBe(null);
            expect(formGroup.controls.c.errors).toBe(null);
        });

        it('should run errors through all interceptors and set control errors and the general error if it is a FormError instance', async (): Promise<void> => {
            const error: Error = new Error('test');
            const generalError: string = 'test';
            const controlErrors: Readonly<
                Record<string, ValidationErrors | null>
            > = {
                a: null,
                b: {
                    test: 'a'
                },
                c: {
                    a: true,
                    b: 123
                }
            };

            errorInterceptorList[1].handle = (error: unknown): FormError => {
                return new FormError({
                    originalError: error,
                    generalError,
                    controlErrors
                });
            };
            formContainer.submit = (): never => {
                throw error;
            };

            await component.onSubmit(new CustomEvent('test'));

            expect(component.hasError).toBe(true);
            expect(component.error).toBe(generalError);

            expect(formGroup.errors).toBe(null);
            expect(formGroup.controls.a.errors).toBe(controlErrors.a);
            expect(formGroup.controls.b.errors).toBe(controlErrors.b);
            expect(formGroup.controls.c.errors).toBe(controlErrors.c);
        });
    });
});
