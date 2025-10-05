import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8,
        validate: {
            validator: function(v) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/.test(v);
            },
            message: props => 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un caracter especial (# $ % & * @)'
        }
    },
    roles: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role' 
    }],
    name: { 
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String
    },
    adress: {
        type: String,
    }
}, { timestamps: true });

UserSchema.virtual('age').get(function() {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

export default mongoose.model('User', UserSchema);