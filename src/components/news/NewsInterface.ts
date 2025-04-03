export interface INews {
  id: string;
  title: string;
  content: string;
  publishDate: string;
}

export type NewsFormState = Omit<INews, "id">;
export type AddNewsHandler = (news: NewsFormState) => void;
export type EditNewsHandler = (news: INews) => void;