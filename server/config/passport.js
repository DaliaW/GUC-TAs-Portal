const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const tokenKey = require('./keys').secretOrKey

const StaffMember = require('../models/StaffMember')

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = tokenKey

module.exports = function (passport) {
    passport.use('staffMembers',
        new LocalStrategy({ gucId: 'gucId' }, (gucId, password, done) => {
            //Match User
            User.findOne({ gucId: gucId })
                .then(staffMember => {
                    if (!staffMember) {
                        return done(null, false, { message: 'This id is not registered' })
                    }
                    bcrypt.compare(password, staffMember.password, (err, isMatch) => {
                        if (err)
                            throw err
                        if (isMatch) {
                            return done(null, user)
                        }
                        else {
                            return done(null, false, { message: 'Wrong Username or Password!' })
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )
    passport.serializeUser(function (member, done) {
        done(null, member.gucId)
    })

    passport.deserializeUser(function (gucId, done) {
        StaffMember.findById(gucId, function (err, member) {
            done(err, member)
        })
    })

    passport.use('memberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff) return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('HRAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type === 'HR') return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('AcademicMemberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type === 'Academic Member') return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('AcademicMemberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type.type === 'teaching assistant') return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('AcademicMemberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type.type === 'course instructor') return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('AcademicMemberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type.type === 'course coordinator') return done(null, currentStaff)
        return done(null, false)
    }))

    passport.use('AcademicMemberAuth', new JwtStrategy(opts, async (jwtPayload, done) => {
        const currentStaff = await StaffMember.findById(jwtPayload.gucId)
        if (currentStaff && currentStaff.type.type === 'HOD') return done(null, currentStaff)
        return done(null, false)
    }))
}