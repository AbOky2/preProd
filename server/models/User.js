const mongoose = require('mongoose');
const { isMajor, pick } = require('../../helpers/convertAndCheck');
const {
  RoleList,
  StatusList,
  Student,
  Inactive,
  generateSlug,
  Roomer,
  ucFirst,
  isValidateEmail,
} = require('../../helpers/user');
const DBModel = require('./Model');
const PropertyModel = require('./Propertie');
const msg = require('../utils/message');
const bcrypt = require('../utils/bcrypt');
const { ROOT_URL } = require('../../config');

// const { sendMail } = require("../services/mail");
const logger = require('../logs');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  picture: {
    type: String,
    default: `${ROOT_URL}/public/img/users/default-picture.png`,
    // required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Propertie' }],
  sponsorshipCode: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Date,
    validate: {
      validator: (v) => isMajor(v),
      message: msg.notMajor,
    },
  },
  school: {
    type: String,
  },
  role: {
    type: String,
    enum: RoleList,
    default: Roomer,
    required: true,
  },
  status: {
    type: String,
    enum: StatusList,
    default: Inactive,
    // required: true,
  },
  provider: {
    type: String,
  },
});

class UserClass extends DBModel {
  static publicFields() {
    return [
      '_id',
      'picture',
      'firstName',
      'lastName',
      'bookmarks',
      'school',
      'phone',
      'email',
      'isAdmin',
      'slug',
      'role',
      'status',
      'age',
    ];
  }

  static async getId(where) {
    const user = await this.findOne(where).select('_id').lean();

    if (!user) return { userId: null };

    return { userId: user._id };
  }

  static async getUserZones(_id) {
    const list = await this.findOne(_id).select('zones').lean();

    return { list };
  }

  static async getIdBySlug({ slug }) {
    return this.getId({ slug });
  }

  static async listStudents(options) {
    const { users: students } = await this.list({ role: Student }, options);

    return { students };
  }

  static async add(options) {
    const { email, firstName, lastName } = options;
    const slug = await generateSlug(this, firstName + lastName);
    const salt = await bcrypt.genSalt(10);

    let user = options;

    if (!isValidateEmail(user.email)) throw new Error(msg.invalidInfo('Email'));
    user.firstName = ucFirst(user.firstName);
    user.lastName = ucFirst(user.lastName);

    user.password = await bcrypt.hash(user.password, salt);
    user = await this.create({ ...options, slug });

    if (email) {
      // Send Email
    }

    return { user };
  }

  static async addBookmark(id, propertyId) {
    const userDoc = await this.findById(id);
    const property = await PropertyModel.findById(propertyId);
    let index = -1;

    // eslint-disable-next-line no-cond-assign
    if (userDoc.bookmarks && (index = userDoc.bookmarks.indexOf(property._id)) >= 0)
      userDoc.bookmarks.splice(index, 1);
    else if (userDoc.bookmarks && userDoc.bookmarks.length) userDoc.bookmarks.push(property._id);
    else userDoc.bookmarks = [property._id];
    userDoc.save();
    return { user: userDoc };
  }

  /**
   * Get a User by its slug
   * @param {Object} params
   * @param {String} params.slug - The slug of the User to get
   */
  static async getBySlug({ slug }) {
    const userDoc = await this.findOne({ slug }).select(this.publicFields());

    if (!userDoc) {
      throw new Error(msg.notFound('User'));
    }
    const user = userDoc.toObject();

    return { user };
  }

  /**
   * Get a User by its slug
   * @param {Object} params
   * @param {String} params.slug - The slug of the User to get
   */
  static async getById(_id) {
    let userDoc = null;

    try {
      userDoc = await this.findOne({ _id }).populate('bookmarks').select(this.publicFields());
      if (!_id || !userDoc) {
        throw new Error(msg.notFound('User'));
      }
      userDoc = userDoc.toObject();
    } catch (err) {
      logger.error(err);
    }

    return userDoc;
  }

  static async signInOrSignUpViaSocialMedia({
    role,
    email,
    password,
    provider,
    avatarUrl,
    firstName,
    lastName,
  }) {
    let user = await this.findOne({ email });

    if (!user) {
      user = (
        await this.add({
          role,
          email,
          password,
          firstName,
          provider,
          lastName,
          picture: avatarUrl,
        })
      ).user;
    }
    user = user.toObject();

    return pick(user, this.publicFields());
  }

  static async signIn(options) {
    const { email, password } = options;

    let user = await this.findOne({ email });

    if (!user) throw new Error(msg.notFound('Email'));
    if (!user.password) throw new Error('Account has no password.');

    const isMatch = await bcrypt.compare(password, user.password);

    user = user.toObject();
    if (isMatch) return pick(user, this.publicFields());
    throw new Error(msg.invalidInfo('password'));
  }

  static async signUp(options) {
    let user = null;

    if (await this.findOne({ email: options.email })) {
      throw new Error(msg.alreadyExist('Email'));
    }

    user = (await this.add(options)).user;
    user = user.toObject();

    return pick(user, this.publicFields());
  }
}

mongoSchema.loadClass(UserClass);
// mongoSchema.pre("save", async () => {
//   const user = this;

//   console.log(user, this);
//   if (!isValidateEmail(user.email)) throw "Invalid email";
//   user.firstName = ucFirst(user.firstName);
//   user.lastName = ucFirst(user.lastName);
//   if (!user.password || !user.isModified("password")) return;
//   const salt = await bcrypt.genSalt(10);

//   user.password = await bcrypt.hash(user.password, salt);
// });

const User = mongoose.model('User', mongoSchema);

module.exports = User;
