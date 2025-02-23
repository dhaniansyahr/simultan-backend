export interface AclDTO {
    id: string;
    featureName: string;
    actions: string[];
}

export interface AclCreateDTO {
    aksesLevelId: number;
    acl: {
        namaFitur: string;
        actions: string[];
    }[];
}
