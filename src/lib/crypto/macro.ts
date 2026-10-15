export type MacroItem = {
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
  tagFa: string;
  tagEn: string;
};

export type MacroDesk = {
  items: MacroItem[];
  source: string;
  note: string | null;
};
