
interface CallsHeaderProps {
  title: string;
  description: string;
}

export const CallsHeader = ({ title, description }: CallsHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
};
