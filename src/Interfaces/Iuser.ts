type Role = 'USER' | 'ADMIN' | 'SELLER';

interface Iuser {
  username: string;
  password: string;
  role?: Role;
  email: string;
  name: string;
  cpf: string;
}

export default Iuser;
