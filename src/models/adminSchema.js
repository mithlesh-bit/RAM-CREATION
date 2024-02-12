const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const registerSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    money: String
})

registerSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.secretkey)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;
        // iufsh
    } catch (error) {
        console.log(error);
    }
}

registerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = await bcrypt.hash(this.password, 12);
    }
    next()
})

module.exports = mongoose.model("admin", registerSchema)