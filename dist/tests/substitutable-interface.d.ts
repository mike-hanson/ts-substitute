export interface ISubstitutable {
    stringProp: string;
    numberProp: number;
    voidMethod(): void;
    voidMethodWithArg(arg1: string): void;
    stringMethod(arg1: string, arg2: number): string;
    asyncMethod(arg1: number, arg2: string): Promise<boolean>;
}
