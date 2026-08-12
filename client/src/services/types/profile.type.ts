export type ProfileResponse = {
    uuid: string;
    username: string;
    avatar_url: string;
    full_name: string;
    company_name: string;
    address: string;
    phone: string;
}

export type UpdateProfileForm = {
    avatar_url: string;
    full_name: string;
    company_name: string;
    address: string;
    phone: string;
}