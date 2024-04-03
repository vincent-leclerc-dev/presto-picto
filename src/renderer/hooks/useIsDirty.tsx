export default function useIsDirty(
  currentState: unknown,
  initialState: unknown,
) {
  return JSON.stringify(currentState) !== JSON.stringify(initialState);
}
