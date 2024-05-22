// Since the dev server re-requires the bundle, this is required to ensure items persist.
// Borrowed/modified from https://github.com/jenseng/abuse-the-platform/blob/2993a7e846c95ace693ce61626fa072174c8d9c7/app/utils/singleton.ts

const singleton = async <Value>(
  name: string,
  value: () => Value | Promise<Value>,
): Promise<Value> => {
  const yolo = global as any
  yolo.__singletons ??= {}
  yolo.__singletons[name] ??= await value()
  return yolo.__singletons[name]
}

export default singleton
