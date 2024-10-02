package tw.luna.FinalTest.service;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tw.luna.FinalTest.dto.cart.CartInsertDto;
import tw.luna.FinalTest.dto.cart.CartSelectDto;
import jakarta.transaction.Transactional;
import tw.luna.FinalTest.model.*;
import tw.luna.FinalTest.repository.CartItemsRepository;
import tw.luna.FinalTest.repository.CartRepository;
import tw.luna.FinalTest.repository.CouponRepository;
import tw.luna.FinalTest.repository.ProductRepository;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    CartItemsRepository cartItemsRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CouponRepository couponRepository;

    @Transactional
    public void addToCart(CartInsertDto cartInsertDto, Long userId) {
        Cart cart = cartRepository.findByUsersUserId(userId);
        Product product = productRepository.findProductByName(cartInsertDto.getProductName());

        CartItems cartItem = cartItemsRepository.findByCartCartIdAndProductName(cart.getCartId(), cartInsertDto.getProductName());

        if (cartItem == null) {
            // Product doesn't exist in the cart, add new item
            cartItem = new CartItems();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(Math.max(cartInsertDto.getQuantity(), 1));
            cartItem.setPrice(product.getPrice());
        } else {
            // Product exists in the cart, update quantity
            cartItem.setQuantity(cartItem.getQuantity() + Math.max(cartInsertDto.getQuantity(), 1));
        }

        cartItemsRepository.save(cartItem);
    }


    //根據用戶 ID 獲取該用戶的購物車項目
    public List<CartSelectDto> getCartItemsByUserId(Long userId) {
        Cart cart = cartRepository.findByUsersUserId(userId);
        List<CartItems> cartItems = cart.getCartItems();
        List<CartSelectDto> result = new ArrayList<>(cartItems.size());

        for (CartItems cartItem : cartItems) {
            Product product = cartItem.getProduct();
            CartSelectDto dto = new CartSelectDto(
                    cartItem.getCartitemsId(),
                    cartItem.getPrice(),
                    cartItem.getQuantity(),
                    product.getName()
            );
            result.add(dto);
        }
        return result;
    }

    //將商品加入購物車 (新增或修改數量)
    @Transactional
    public void updateCart(CartInsertDto cartInsertDto, Long userId) {
        Cart cart = cartRepository.findByUsersUserId(userId);
        Product product = productRepository.findProductByName(cartInsertDto.getProductName());
        System.out.println(product);
        CartItems isPresent = cartItemsRepository.findByCartCartIdAndProductName(cart.getCartId(),cartInsertDto.getProductName());
        if(isPresent == null) {          //購物車內目前不存在該商品 ->新增
            CartItems cartItems = new CartItems();
            cartItems.setCart(cart);
            cartItems.setProduct(product);
            cartItems.setQuantity(Math.max(cartInsertDto.getQuantity(), 1));
            //單價
            cartItems.setPrice(product.getPrice());
            cartItemsRepository.save(cartItems);
        }else {  //購物車內已存在該商品 ->更新數量

            isPresent.setQuantity(Math.max(cartInsertDto.getQuantity(), 1));
            cartItemsRepository.save(isPresent);
        }
    }

    //清空購物車內的所有商品
    @Transactional
    public void deleteAllCartItems(Long userId) {
        Cart cart = cartRepository.findByUsersUserId(userId);
        cartItemsRepository.deleteByCartCartId(cart.getCartId());
    }

    //刪除購物車內某項商品
    @Transactional
    public void deleteCartItemsByProductId(Long userId, String name) {

        // 找到該用戶的購物車
        Cart cart = cartRepository.findByUsersUserId(userId);
        //找到購物車中的該商品
        CartItems isPresent = cartItemsRepository.findByCartCartIdAndProductName(cart.getCartId(),name);

        if(isPresent != null)  { //商品存在
        //刪除商品
        cartItemsRepository.delete(isPresent);
         } else {
            throw new RuntimeException("購物車內無此商品");
        }
    }


    // 應用優惠券到購物車 (不改動 Cart 模型)
    // 應用優惠券到購物車，並返回計算結果
    @Transactional
    public Map<String, Object> applyCouponToCart(Long cartId, String couponCode) {
        // 查詢購物車
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("找不到購物車"));

        // 查詢優惠券
        Coupon coupon = couponRepository.findCouponByCode(couponCode);
        if (coupon == null) {
            throw new RuntimeException("找不到優惠券");
        }


        // 確認優惠券是否有效
        if (!coupon.isActive() || coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("優惠券無效或已過期");
        }

        // 計算購物車總金額
        int totalAmount = cart.getCartItems().stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        // 計算優惠
        int percentageDiscount = 0;
        int amountDiscount = 0;
        int finalAmount = totalAmount;

        // 根據優惠券類型計算折扣
        if (coupon.getDiscountType() == DiscountType.percentage) {
            percentageDiscount = (totalAmount * coupon.getDiscountValue()) / 100;
            finalAmount = totalAmount - percentageDiscount;
        } else if (coupon.getDiscountType() == DiscountType.amount) {
            amountDiscount = coupon.getDiscountValue();
            finalAmount = totalAmount - amountDiscount;
        }

        // 返回計算結果，並不將優惠券保存到購物車中
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "優惠券已成功應用");
        response.put("cartTotal", totalAmount);
        response.put("percentageDiscount", percentageDiscount);
        response.put("amountDiscount", amountDiscount);
        response.put("finalAmount", finalAmount);

        return response;
    }





}










