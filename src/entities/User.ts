export interface UserJWTDAO {
    id: string;
    email: string;
    fullName: string;
    userLevelId: string;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface UserRegisterDTO {
    id: string;
    fullName: string;
    email: string;
    password: string;
}

export interface UserDTO {
    id: string;
    fullName: string;
    email: string;
}

// Exclude keys from user
export function exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
