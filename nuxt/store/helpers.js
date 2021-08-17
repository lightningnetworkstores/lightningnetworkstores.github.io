export function normalizeRelations(data, fields) {
  return {
    ...data,
    ...fields.reduce(
      (prev, field) => ({
        ...prev,
        [field]: Array.isArray(data[field])
          ? data[field].map((x) => x.id)
          : data[field].id,
      }),
      {}
    ),
  }
}

export function resolveRelations(data, fields, entities) {
  return {
    ...data,
    ...fields.reduce(
      (prev, field) => ({
        ...prev,
        [field]: Array.isArray(data[field])
          ? data[field].map((id) => entities.find((entity) => entity.id === id))
          : entities.find((entity) => entity.id === data[field]),
      }),
      {}
    ),
  }
}
