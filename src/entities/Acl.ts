export interface AclDTO {
    id: string;
    featureName: string;
    actions: string[];
}

export interface AclCreateDTO {
    userLevelId: string;
    acl: AclDTO[];
}
