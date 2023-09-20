export interface SignUpData {
    name: string;
    email: string;
    password: string
};

export interface SignInData {
    email: string;
    password: string;
};

export interface User {
    data: {
        id: string;
        name: string;
        email: string;
    };
    token: string
}

export interface CreateSessionData {
    userId: string,
    roomId: string
}

