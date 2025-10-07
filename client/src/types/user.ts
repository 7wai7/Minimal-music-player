export default interface UserDTO {
    id: number;
    login: string;
    profile: {
        id: number,
        avatar_url?: string;
    }
    isOwnProfile: boolean;
}