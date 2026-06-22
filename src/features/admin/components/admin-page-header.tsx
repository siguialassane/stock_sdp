interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Action placee a droite (bouton d'ajout, etc.). */
  action?: React.ReactNode;
}

/**
 * En-tete standard des sous-ecrans Admin.
 * Garde la meme hierarchie typographique que le header principal :
 * titre en text-lg / md:text-2xl, sous-titre en text-sm text-muted-foreground.
 */
export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
