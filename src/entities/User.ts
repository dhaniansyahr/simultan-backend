export interface UserJWTDAO {
    id: number;
    ulid: string;
    nama: string;
    aksesLevelId: number;
}

export interface UserLoginDTO {
    identityNumber: string;
    password: string;
}

export interface UserRegisterDTO {
    id: number;
    ulid: string;
    nama: string;
    npm?: string;
    password: string;
}

export interface UserDTO {
    id: number;
    nama: string;
    npm?: string;
}

// Exclude keys from user
export function exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
