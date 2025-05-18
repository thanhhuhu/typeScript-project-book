export {};
// định nghĩa data
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }
    interface IRegister {
        _id:string;
        email: string;
        fullName: string;
    }
    interface IUser{
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
    }
    interface IFetchAccount{
        user:IUser;
    }
    interface IUserTable{
        id: string;
        fullName: string;
        email: string;
        price:string;
        phone: string;
        role: string;
        avatar: string;
        isActive:boolean;
        createdAt: Date;
        updatedAt: Date;
        _id:string;
        mainText: string;
        author:string;
        category:string;
        thumbnail:any;
        slider:any;
    }
    interface IResponseImport{
        countSuccess: number
        countError: number
        detail: any
    }
    interface IBookTable{
        _id: string;
        thumbnail:string;
        slider:string[];
        mainText:string;
        author:string;
        price:string;
        sold:string;
        quantity:string;
        category:string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface ICreateBook {
        _id: string;
        mainText: string;
        author: string;
    }
    interface ICart{
        _id: string;
        quanity: string;
        mainText: string;
        carts:string[];
    }
}


