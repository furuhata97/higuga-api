export default interface ISearchProductDTO {
  search_word: string;
  category_id: string;
  take: number;
  skip: number;
  type: string;
}
