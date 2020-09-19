export default interface IGetCategoriesDTO {
  take: number;
  skip: number;
  search: string | undefined;
}
