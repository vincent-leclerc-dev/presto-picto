import { Colors, colors } from '../../../ui';

interface ITagsProps {
  dataSlice: string[];
  initialDataSize: number;
  width?: string;
  color?: Colors;
}

function Tags({
  dataSlice,
  initialDataSize,
  width = Tags.defaultProps.width,
  color = Tags.defaultProps.color, // TODO use theme provider
}: ITagsProps) {
  return (
    <ul className={`${width} grid grid-cols-2 grid-rows-2 gap-2 mt-4`}>
      {dataSlice.map((tag: string) => (
        <li
          key={tag}
          className={`flex flex-col items-center justify-center text-center
          h-6 px-2 text-xs rounded-full ${colors[color].bgPrimary} ${colors[color].textPrimary}`}
        >
          {tag}
        </li>
      ))}
      {initialDataSize > 3 && (
        <li
          key={initialDataSize}
          className={`p-1 text-xs ${colors[color].bgPrimaryLight} ${colors[color].textPrimaryLight} rounded-full text-center`}
        >
          +{initialDataSize - 3}
        </li>
      )}
    </ul>
  );
}

Tags.defaultProps = {
  width: 'w-auto',
  color: Colors.SKY,
};

export default Tags;
