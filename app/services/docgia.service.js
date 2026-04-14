const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require("./email.service");

class DocgiaService {
    constructor(client) {
        this.Docgia = client.db().collection('docgia');
    }

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10); // Tạo salt với độ khó 10
        const hashedPassword = await bcrypt.hash(password, salt); // Băm mật khẩu
        return hashedPassword;
    }

    generateSecureRandomString() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const array = new Uint8Array(6);
        crypto.getRandomValues(array);
        array.forEach((num) => {
            result += chars[num % chars.length];
        });
        return result;
    }


    async extractDocgiaData(payload) {
        const pass = this.generateSecureRandomString()
        const docgia = {
            _id: payload._id,
            tenDG: payload.tenDG,
            diachiDG: payload.diachiDG,
            gioitinhDG: payload.gioitinhDG,
            ngaysinhDG: payload.ngaysinhDG,
            dienthoaiDG: payload.dienthoaiDG,
            taikhoanDG: payload._id,
            emailDG: payload.emailDG,
            matkhauDG: await this.hashPassword(pass),
        };
        // remove undefined fields
        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return { docgia: docgia, plainPassword: pass };
    }

    async create(payload) {
        
        const { docgia, plainPassword } = await this.extractDocgiaData(payload);
        
        // const result = await this.Docgia.findOneAndUpdate(
        //     docgia, // ✅ Đúng: Tìm theo _id để cập nhật
        //     { $set: docgia },
        //     { returnDocument: 'after', upsert: true }
        // );

        // Kiểm tra nếu đã tồn tại độc giả với _id
        const existingDocgia = await this.Docgia.findOne({ _id: docgia._id });
        if (existingDocgia) {
            throw new Error('Tài khoản độc giả đã tồn tại!');
        }

        // Thêm độc giả mới
        const result = await this.Docgia.insertOne(docgia);

        await sendEmail(
            docgia.emailDG,
            'Thông tin tài khoản đọc giả của bạn',
            `Xin chào ${docgia.tenDG},\n\nTài khoản của bạn đã được tạo thành công.\nTên đăng nhập: ${docgia.taikhoanDG}\nMật khẩu: ${plainPassword}\n\nVui lòng đổi mật khẩu sau khi đăng nhập.`
        );
        return result;
    }


    async find (filter) {
        const cursor = this.Docgia.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenDG: {$regex: new RegExp(new RegExp(name)), $options: 'i'}
        });
    }

    async findByTaiKhoan(taikhoanDG) {
        return await this.find({
            taikhoanDG: taikhoanDG
        });
    }

    async findById(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error('Invalid ObjectId');
        // }
        
        try {
            const docgia = await this.Docgia.findOne({
                _id: id,
            });
            if (!docgia) {
                console.error('Không tìm thấy tài liệu độc giả:', id);
                throw new Error('Không tìm thấy tài liệu độc giả với id');
            }
            return docgia;
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm độc giả:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: id ? id : null,
        };    
        const update = {
            _id: payload._id,
            tenDG: payload.tenDG,
            diachiDG: payload.diachiDG,
            gioitinhDG: payload.gioitinhDG,
            ngaysinhDG: payload.ngaysinhDG,
            dienthoaiDG: payload.dienthoaiDG,
            matkhauDG: payload.matkhauDG,
        };
        const result = await this.Docgia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.Docgia.findOneAndDelete({
            _id: id ? id : null,
        });
        return result;
    }

    async deleteAll (){
        const result = await this.Docgia.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = DocgiaService;