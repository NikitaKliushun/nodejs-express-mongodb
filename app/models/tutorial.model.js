module.exports = (mongoose,mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Tutorial = mongoose.model("tutorial", schema);
  return Tutorial;
};
