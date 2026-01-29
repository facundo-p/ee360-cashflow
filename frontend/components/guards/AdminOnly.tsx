import { useAuth } from '../../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
};

export default function AdminOnly({ children }: Props) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}
