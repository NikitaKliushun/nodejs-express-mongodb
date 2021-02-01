module.exports = (mongoose,mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      login: String,
      firstName: String,
      lastName: String,
      email: String,
      age: Number,
      imageData: {
          type: String,
          required: true
      },
      tutorials: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tutorial"
        }
      ]
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const User = mongoose.model("user", schema);
  return User;
};
