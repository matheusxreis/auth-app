interface User {
username: string;
id: string;
}

export interface SignInResponseDTO {
user: User;
token: string;
timestamp: number;
}
