export interface Category {
  slug: string;
  title: string;
}

export interface CategoryHero {
  title: string;
  description: string;
  image: string;
  recommendedFor: string[];
}

export interface CategoryTab {
  name: string;
  desc: string;
  pills: string[];
}

export type CategoryChallengeIcon =
  | "downtime"
  | "cost"
  | "error"
  | "inconsistent";

export interface CategoryChallenge {
  icon: CategoryChallengeIcon;
  title: string;
  desc: string;
}

export interface CategoryDetail {
  slug: string;
  hero: CategoryHero;
  tabs: CategoryTab[];
  challenges: CategoryChallenge[];
}
