import Tags from './Tags';

interface ImageContainerProps {
  data: string[];
  limit?: number;
}
function TagsContainer({
  data,
  limit = TagsContainer.defaultProps.limit,
}: ImageContainerProps) {
  return (
    <Tags dataSlice={data.slice(0, limit)} initialDataSize={data.length} />
  );
}

TagsContainer.defaultProps = {
  limit: 3,
};

export default TagsContainer;
