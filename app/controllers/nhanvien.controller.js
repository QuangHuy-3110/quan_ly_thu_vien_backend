const NhanvienService = require('../services/nhanvien.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenNV){
        return next(new ApiError(400, 'Tên không được bỏ trống'));
    }

    if (!req.body?.chucvuNV){
        return next(new ApiError(400, 'Chức vụ không được bỏ trống'));
    }

    if (!req.body?._id){
        return next(new ApiError(400, 'Id không được bỏ trống'));
    }

    try {
        const nhanvienService = new NhanvienService(MongoDB.client);        
        const document = await nhanvienService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi tạo nhân viên mới")
        );
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nhanvienService = new NhanvienService(MongoDB.client);
        const {name} = req.query;
        const {taikhoanNV} = req.query;
        if (name) {
            documents = await nhanvienService.findByName(name);
        }else if(taikhoanNV) {
            documents = await nhanvienService.findByTaiKhoan(taikhoanNV);
        } else {
            documents = await nhanvienService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm nhân viên')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const nhanvienService = new NhanvienService(MongoDB.client);
        
        const document = await nhanvienService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Nhân viên không tồn tại'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Có lỗi xảy ra trong khi tìm kiếm id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được để trống'));
    }

    try {
        const nhanvienService = new NhanvienService(MongoDB.client);
        const document = await nhanvienService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'Nhân viên không tồn tại'));
        }
        return res.send({message: 'Nhân viên được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const nhanvienService = new NhanvienService(MongoDB.client);
        const document = await nhanvienService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Nhân viên không tồn tại'));
        }
        return res.send({message: 'Nhân viên được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xóa id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const nhanvienService = new NhanvienService(MongoDB.client);
        const deletedCount = await nhanvienService.deleteAll();
        return res.send({
            message: `${deletedCount} nhân viên được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lỗi xảy ra trong khi xóa')
        );
    }
}