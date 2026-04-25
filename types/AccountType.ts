import { DateTime } from "next-auth/providers/kakao";

export interface Accounts {
    id: number;
    username: string;
    email: string;
    password: string;
    profile_image: string;
    is_active: boolean;
    role: string;
    created_at: DateTime;

}