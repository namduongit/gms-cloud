export type LoginForm = {
    email: string;
    password: string;
}

export type RegisterForm = {
    email: string;
    password: string;
    confirmPassword: string;
}

export type LoginResponse = {
    email: string;
    role: string;
    plan: string;
}

export type RegisterResponse = {
    email: string;
    plan: string;
}

export type ConfigResponse = boolean;