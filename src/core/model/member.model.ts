export interface Member {
  id?: number;
  name?: string;
  email?: string;
  roles?: string[];
}

export interface MemberLogin extends Member {
  password: string;
}


export interface registerUser {
  username: string
  password: string
  email: string;
  image: string;
  firstName: string;
  lastName: string;
  phone: string;
  nhanvienid: number;
  nhanvienidStr: string;
  city: string;
  role: string;
  address: string;
  status: boolean;
  
  // address: string;
  // address2: string;
}

export interface UserRegister extends registerUser {
  password: string;
}
