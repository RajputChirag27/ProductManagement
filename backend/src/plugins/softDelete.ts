import mongoose from 'mongoose'

export type TWithSoftDeleted = {
  isDeleted: boolean
  deletedAt: Date | null
}

type TDocument = TWithSoftDeleted & mongoose.Document

const softDeletePlugin = (schema: mongoose.Schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  })

  const typesFindQueryMiddleware = [
    'count',
    'find',
    'findOne',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany'
  ]

  const setDocumentIsDeleted = async (doc: TDocument) => {
    doc.isDeleted = true
    doc.deletedAt = new Date()
    await doc.save({ validateBeforeSave: false })
  }

  const excludeInFindQueriesIsDeleted = function (
    this: mongoose.Query<TDocument, TDocument>,
    next: Function
  ) {
    this.where({ isDeleted: false })
    next()
  }

  const excludeInDeletedInAggregateMiddleware = function (
    this: mongoose.Aggregate<any>,
    next: Function
  ) {
    this.pipeline().unshift({ $match: { isDeleted: false } })
    next()
  }

  // Middleware for soft-deleting documents
  schema.pre('findOneAndDelete', async function (this: any) {
    const doc = await this.model.findOne(this.getQuery())
    if (doc) {
      await setDocumentIsDeleted(doc as TDocument)
    }
  })

  // Use type assertion for findOneAndRemove
  ;(schema as any).pre('findOneAndRemove', async function (this: any) {
    const doc = await this.model.findOne(this.getQuery())
    if (doc) {
      await setDocumentIsDeleted(doc as TDocument)
    }
  })

  // Use type assertion for remove
  ;(schema as any).pre('remove', async function (this: TDocument) {
    await setDocumentIsDeleted(this)
  })

  typesFindQueryMiddleware.forEach(type => {
    schema.pre(type as any, excludeInFindQueriesIsDeleted)
  })

  schema.pre('aggregate', excludeInDeletedInAggregateMiddleware)
}

export { softDeletePlugin }
