
const { status } = require("express/lib/response");
const Product = require("../models/Product");

const PAGE_SIZE=5;
const productController = {};

productController.createProduct =async(req,res)=>{
try{
const {
    sku,
    name,
    size,
    image,
    category,
    description,
    price,
    stock,
    status,   
} =req.body;

const product = new Product({
    sku,
    name,
    size,
    image,
    category,
    description,
    price,
    stock,
    status,
});
console.log("createProduct ")
await product.save();

res.status(200).json({status:"success",product});

}catch(error){
    res.status(400).json({status: "fail", error:error.message});
}

};

productController.getProducts=async(req,res)=>{
    try{
        const {page,name} = req.query;
        const cond = name?{name:{$regex:name,$options:"i"},isDeleted: false}:{isDeleted: false};
        let query = Product.find(cond);
        let response = {status:"success"};
        if(page){
            query.skip((page-1) * PAGE_SIZE).limit(PAGE_SIZE);
            //최종 몇개 페이지
            //데이터가 총 몇개있는지
            const totalItemNum = await Product.countDocuments(cond);   //Product.find(cond).count()count 메서드는 더 이상 Mongoose에서 사용되지 않으며, 대신 countDocuments 메서드를 사용
            //데이터 총 개수 /PAGE_SIZE
            const totalPageNum = Math.ceil(totalItemNum/PAGE_SIZE);
            response.totalPageNum=totalPageNum;
        }
        const productList = await query.exec();
        response.data= productList;
        
    // const products = await Product.find({});
    res.status(200).json(response);
    }catch(error){
        res.status(400).json({status: "fail", error:error.message});
    }
    };


// 실제 삭제 로직 
productController.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByIdAndUpdate(
        { _id: productId },
        { isDeleted: true }
      );
      if (!product) throw new Error("No item found");
      res.status(200).json({ status: "success" });
    } catch (error) {
      return res.status(400).json({ status: "fail", error: error.message });
    }
  };



    productController.updateProduct=async(req,res)=>{
        try{
            const productId =req.params.id;
            const {
                sku,
                name,
                size,
                image,
                category,
                description,
                price,
                stock,
                status ,  
            } = req.body;

            const product = await Product.findByIdAndUpdate({_id:productId},
                {
                    sku,
                    name,
                    size,
                    image,
                    category,
                    description,
                    price,
                    stock,
                    status ,  
                },
                {new : true}
            );
            if(!product)
                throw new Error ("상품이 존재하지 않습니다!!");
            res.status(200).json({status:"success",data:product});
        }catch(error){
            res.status(400).json({status: "fail", error:error.message});
        }
    };


    productController.getProductById = async (req, res) => {
        try {
          const productId = req.params.id;
          const product = await Product.findById(productId);
          if (!product) throw new Error("No item found");
          res.status(200).json({ status: "success", data: product });
        } catch (error) {
          return res.status(400).json({ status: "fail", error: error.message });
        }
      };

productController.checkStock=async(item)=>{
// 내가사려는 아이템 재고 정보
const product = await Product.findById(item.productId);
//내가사려는 아이템 재고 비교
if(product.stock[item.size] < item.qty){
//재고 불충분시 메세지와 함께 데이터 반환
return {isVerify:false,message:`${product.name}의 ${item.size}소진 되었습니다!!`}
};

const newStock = {...product.stock};
newStock[item.size] -= item.qty;
product.stock=newStock;

await product.save();
//재고시 성공
return {isVerify:true};
};



//order재고 확인 & 재고 업데이트
productController.checkItemListStock =async(itemList)=>{
const insufficientStockItems =[];  // 재고가 불충분한 아이템을 저장할할 예정
// 재고확인 로직
await Promise.all(   //Promise.all await(비동기처리) 여러개일경우 시간이 오래걸리기때문에 병렬형식(동시에)으로 처리해 빨리처리하게  해주는 함수
itemList.map(async (item)=>{
    const stockCheck = await productController.checkStock(item);
    if(!stockCheck.isVerify){
        insufficientStockItems.push({item,message:stockCheck.message});
    }
    return stockCheck;

})
);
return insufficientStockItems;
       
}



module.exports = productController;