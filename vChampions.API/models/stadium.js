const mongoose = require('mongoose');
let Validator = require("fastest-validator");
let v = new Validator();

const stadiumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
        }
    ],
    address: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 500
    },
    yards: [
        {
            type: new mongoose.Schema({
                name: {
                    type: String,
                    required: true,
                    minlength: 3,
                    maxlength: 50
                },
                prices: [
                    {
                        from: {
                            type: Date,
                            required: true,
                            default: Date.now
                        },
                        to: {
                            type: Date,
                            required: true,
                            default: Date.now
                        },
                        price: {
                            type: Number,
                            min: 0
                        }
                    }
                ],
                isReserved: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                homeClub: {
                    type: new mongoose.Schema({
                        code: {
                            type: String,
                            required: true,
                            minlength: 3,
                            maxlength: 50,
                            unique: true
                        },
                        name: {
                            type: String,
                            required: true,
                            minlength: 3,
                            maxlength: 50
                        },
                        logo: {
                            imgId: { type: String, default: '' },
                            imgVersion: { type: String, default: '' }
                        }
                    })
                },
                visitingClub: {
                    type: new mongoose.Schema({
                        code: {
                            type: String,
                            required: true,
                            minlength: 3,
                            maxlength: 50,
                            unique: true
                        },
                        name: {
                            type: String,
                            required: true,
                            minlength: 3,
                            maxlength: 50
                        },
                        logo: {
                            imgId: { type: String, default: '' },
                            imgVersion: { type: String, default: '' }
                        }
                    })
                },
                realtimeUpdate: {
                    type: String,
                    required: false,
                    minlength: 5,
                    maxlength: 200
                }
            })
        }
    ]
});

const Stadium = mongoose.model('Stadium', stadiumSchema);



exports.stadiumSchema = stadiumSchema;
exports.Stadium = Stadium;