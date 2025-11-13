var totalPrice = 0;
user = {};
data = {};
const pattern = /[^\d]/g; // Không phải là số
const pattern1 = /dung lượng: /i; // dung lượng: chữ hoa và chữ thường
const pattern2 = /ram: /i; // ram: chữ hoa và chữ thường
var payedByCard = 0; // nguoi mua tra tien bang the ngan hang
var dathanhtoan = 0;
/* Hàm tạo dòng mới trong table giỏ hàng */
function getInforProduct(productDiv, a) {
  const productName = productDiv.querySelector(a).textContent;
  const product = productManager.productList.find((p) => p.name === productName);
  if (product) {
    const table = document.querySelector("#cart");
    const newRow = table.insertRow();
    const cellData = newRow.insertCell(0);
    const cellPrice = newRow.insertCell(1);
    const cellQuantity = newRow.insertCell(2);
    const cellTotalPrice = newRow.insertCell(3);
    const cellDelete = newRow.insertCell(4);

    cellData.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.id}" width="80" height="80"/>
        <div>${product.name}</div>
        <div class="detailPhone">
          <div id="storage">Dung Lượng: ${product.storage}</div>
          <div id="ram">Ram: ${product.ram}</div>
        </div>
      </div>`;
    vnMoney = product.price.toLocaleString("vi-VN") + " VNĐ";
    cellPrice.textContent = vnMoney;
    cellQuantity.innerHTML = `
      <div class="control_quantity">
        <button>-</button>
        <div class="quantity">1</div>
        <button>+</button>
      </div>`;
    cellTotalPrice.textContent = vnMoney;
    cellDelete.innerHTML = `<div class="deleteRow">Xoá</div>`;
    totalPrice += parseInt(product.price);
  }
}

// Xoá dòng trong table của giỏ hàng và cập nhập lại tổng số tiền
document.addEventListener("click", function (event) {
  if (event.target.matches(".deleteRow")) {
    const row = event.target.closest("tr");
    const productData = row.cells[0].querySelector("div");
    const productName = productData.querySelector("div").textContent;
    const product = productManager.productList.find((p) => p.name === productName);

    if (product) {
      const quantity = parseInt(row.cells[2].querySelector(".quantity").textContent);
      const price = parseInt(product.price);
      totalPrice -= price * quantity;
      vnMoney = totalPrice.toLocaleString("vi-VN") + " VNĐ";
      document.querySelector("#totalCost").textContent = vnMoney;
    }

    row.remove();
  }
});

// Tăng giảm số lượng sản phẩm trong giỏ hàng và cập nhật lại tổng số tiền
document.addEventListener("click", function (event) {
  if (event.target.matches(".control_quantity button")) {
    const isIncrement = event.target.textContent === "+";
    const row = event.target.closest("tr");
    const quantityDiv = row.querySelector(".quantity");
    let quantity = parseInt(quantityDiv.textContent);
    let vnMoney = row.cells[1].textContent;
    let number = vnMoney.replace(pattern, "");

    const price = parseInt(number);
    const productName = row.cells[0].querySelector("div > div").textContent;
    const product = productManager.productList.find((p) => p.name === productName);

    if (isIncrement) {
      if (quantity < product.quantity) {
        quantity++;
        totalPrice += price
      } else {
        alert("Số lượng sản phẩm không đủ");
      }
    } else if (quantity > 1) {
      quantity--;
      totalPrice -= price;
    }

    quantityDiv.textContent = quantity;
    row.cells[3].textContent = (price * quantity).toLocaleString("vi-VN") + " VNĐ";

    
    
    vnMoney = totalPrice.toLocaleString("vi-VN") + " VNĐ";
    document.querySelector("#totalCost").textContent = vnMoney;
  }
});

// Nhấn nút mua ngay để bỏ sản phẩm vào giỏ hàng với điều kiện đã đăng nhập
document.addEventListener("click", function (event) {
  if (event.target.matches(".muaNgay")) {
    if (sessionStorage.getItem("loggedInUser") == null) {
      alert("Bạn phải đăng nhập vô Website mới được mua hàng");
    } else {
      const productDiv = event.target.closest(".product");
      getInforProduct(productDiv, ".productName");
      alert("Bạn đã thêm sản phẩm vào giỏ hàng thành công");
      vnMoney = totalPrice.toLocaleString("vi-VN") + " VNĐ";
      document.querySelector("#totalCost").textContent = vnMoney;
    }
  }
});

/* Nhấn nút giỏ hàng */
document.querySelector(".cart").addEventListener("click", function () {
  document.querySelector("#shopping_cart_page").style.display = "block";
  if (document.querySelector("#cart").rows.length > 1) {
    document.querySelector("#empty").style.display = "none";
    document.querySelector("#non_empty").style.display = "block";
  }
});

// Xử lý sự kiện khi tick checkbox trong thanh toán
changeCheckbox = () => {
  if (document.querySelector("#cash").checked) {
    document.querySelector("#card").checked = false;
    document.querySelector("#inputBankCard").style.display = "none";
    document.querySelector("#cardNumber").required = false;
    document.querySelector("#nameOnCard").required = false;
    document.querySelector("#dateCreated").required = false;
  }
};
document.querySelector("#return_sc_page").addEventListener("click",() => {
  document.querySelectorAll("#orderDetail").forEach(element => {
    element.remove();
  });
  document.querySelectorAll("#orderHistory").forEach(element => {
    element.remove();
  });
  document.querySelector("#orderHistoryContainer").style.display = "none";
  document.querySelector("#empty").style.display = "flex";
})
//Xem lịch sử mua hàng
function displayOrderHistory() {
  const button = document.querySelector("#readOrderHistory");
  button.style.display = "block"; // Ensure the button is visible
  button.addEventListener("click", () => {
    var checkedOrder = JSON.parse(localStorage.getItem("checkedOrder"));
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var ten = user.username;
    const orders = JSON.parse(localStorage.getItem("orders"));
    orders.forEach(element => {
      if (element.name === ten) {    
        if (checkedOrder) {
          checkedOrder.forEach(check => {
            if(check.id === element.id){
              if (check.mode === "pass") {
                createNewOH(check.id);
                document.querySelector("#empty").style.display = "none";
                document.querySelector("#orderHistoryContainer").style.display = "block";
              }else{
                alert(`Đơn hàng của bạn có mã ${check.id} chưa được ADMIN duyệt`);
              }
            }
          });
        }
      }
    })
  });
}
// Tạo dòng mới trong bảng sản phẩm
function displayProducts(sp, data) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>
      <img src="${sp.img}" alt="${sp.id}" width="80" height="80"/>
      <div>${sp.name}</div>
      <div class="detailPhone">
        <div id="storage">Dung Lượng: ${sp.storage}</div>
        <div id="ram">Ram: ${sp.ram}</div>
      </div>
    </td>
    <td>${sp.quantity}</td>
    <td>${sp.totalPrice}</td>`;
  data.appendChild(newRow);
};
//Tạo đơn hàng mới
function createNewOH(id) {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  var ten = user.username;
  const orders = JSON.parse(localStorage.getItem("orders"));
  const ohContainer = document.querySelector("#orderData");
  orders.forEach(element => {
    if (element.id === id && element.name === ten) {
      const dataOrder = document.createElement("div");
      dataOrder.id = "orderDetail"
      dataOrder.innerHTML = `
        <div>Mã đơn hàng: ${element.id}</div>
        <div>Số lượng điện thoại đã mua: ${element.quantity}</div>
        <div>Số tiền đã trả: ${element.payedMoney.toLocaleString("vi-VN")+" VNĐ"}</div>`
      ohContainer.appendChild(dataOrder);
      const table = document.createElement("table");
      table.id = "orderHistory";
      table.innerHTML= `<table>
        <tr>
          <td>Thông tin sản phẩm</td>
          <td>Số lượng</td>
          <td>Thành tiền</td>
        </tr>
      </table>`
      element.boughtProducts.forEach(products =>{displayProducts(products,table)});
      ohContainer.appendChild(table);
    }
  });
}
// Lấy toàn bộ dữ liệu điện thoại đã mua của khách hàng lưu vào local storage
getUserBoughtPhones = (table) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const rows = table.querySelectorAll("tr");
  const boughtProductList = [];
  var boughtQuantity = 0;
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip the header row
    const cells = row.querySelectorAll("td");
    const imgElement = cells[0].querySelector("div > img");
    const nameElement = cells[0].querySelector("div > div");
    const storageElement = cells[0].querySelector("div > .detailPhone > #storage");
    const ramElement = cells[0].querySelector("div > .detailPhone > #ram");
    const boughtProduct = {
      img: imgElement ? imgElement.src : "",
      id: imgElement ? imgElement.alt : "",
      name: nameElement ? nameElement.textContent : "",
      storage: storageElement ? storageElement.textContent.replace(pattern1, "") : "",
      ram: ramElement ? ramElement.textContent.replace(pattern2, "") : "",
      quantity: cells[2].querySelector(".control_quantity > .quantity") ? cells[2].querySelector(".control_quantity > .quantity").textContent : "0",
      totalPrice: cells[3].textContent
    };
    boughtQuantity += parseInt(boughtProduct.quantity);
    boughtProductList.push(boughtProduct);
  });
  const orderId = `ORD${String(orders.length + 1).padStart(3, '0')}`;
  const userName = document.querySelector("#customerName");
  const userAddress = document.querySelector("#customerAddress");
  const userPhone = document.querySelector("#cusPhoneNumber");
  const day = new Date();
  user.id = orderId;
  data.id = orderId;
  user.name = userName.value;
  user.address = userAddress.value;
  user.phone = userPhone.value;
  user.boughtDate = day;
  user.quantity = boughtQuantity;
  user.payedMoney = totalPrice;
  user.boughtProducts = boughtProductList;
  orders.push(user);
  localStorage.setItem("orders", JSON.stringify(orders));
}
// Xử lý sự kiện sau khi người dùng nhấn đặt hàng
document.querySelector("#dat_hang").addEventListener("click", () => {
  const dataUser = sessionStorage.getItem("loggedInUser");
  if (dataUser) {
    var khachHang = JSON.parse(dataUser);
    const a = document.querySelector("#frmdathang #customerAddress");
    const b = document.querySelector("#frmdathang #cusPhoneNumber");
    document.querySelector("#frmdathang #customerName").value = khachHang.username;
    document.querySelector("#customerName").readOnly = true;
    a.value = khachHang.address;
    b.value = khachHang.phone;
    a.required = true;
    b.required = true;
    document.querySelector("#khung_dat_hang").style.display = "block";
    document.querySelector("#khung_dat_hang").style.overflow = "hidden";
  }
});
// Nhấn nút X
document.querySelector("#dong_dat_hang").addEventListener("click", () => {
  document.querySelector("#khung_dat_hang").style.display = "none";
});
//Kiem tra thong tin dat hang truoc khi submit from
function validatePhoneNumber()
{
  const phonePattern = /[0-9]{10}/;
  const userPhone = document.querySelector("#cusPhoneNumber").value;

  if (!phonePattern.test(userPhone)) {
    alert("Số điện thoại không đúng định dạng");
    return false;
  }
  document.querySelector("#frmdathang").style.display = "none";
}
document.querySelector("#frmdathang").onsubmit = (event) => {
  event.preventDefault();
  return validatePhoneNumber();
};

document.querySelectorAll("input[type=checkbox]").forEach(a => {
  payedByCard = 0;
  dathanhtoan = 0;
  if (a.id === "card") {
    a.addEventListener("change", () => {
      if (a.checked === false) {
        //Nếu khách hàng bỏ tích thanh toán bằng tiền mặt
        document.querySelector("#inputBankCard").style.display = "none";
        document.querySelector("#cardNumber").required = false;
        document.querySelector("#nameOnCard").required = false;
        document.querySelector("#dateCreated").required = false;
        payedByCard--;
        dathanhtoan--;
      } else {      
        //Nếu khách hàng bỏ tích thanh toán bằng thẻ ngân hàng 
        document.querySelector("#cash").checked = false;
        document.querySelector("#inputBankCard").style.display = "block";
        document.querySelector("#cardNumber").required = true;
        document.querySelector("#nameOnCard").required = true;
        document.querySelector("#dateCreated").required = true;
        payedByCard++;
        dathanhtoan++;
      }
    })
  }
  if (a.id === "cash") {
    a.addEventListener("change", () => {
      if (a.checked === false) {
        dathanhtoan--;
      }else{
        document.querySelector("#card").checked = false;
        document.querySelector("#inputBankCard").style.display = "none";
        document.querySelector("#cardNumber").required = false;
        document.querySelector("#nameOnCard").required = false;
        document.querySelector("#dateCreated").required = false;
        dathanhtoan++;
      }
    })
  }
})

function displayOrder() {
  let orderTableBody = document.getElementById("orderTableCustomer");
  orderTableBody.innerHTML = "";
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let checkedOrders = JSON.parse(localStorage.getItem("checkedOrder")) || [];

  if (orders.length === 0) {
      orderTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Không có đơn hàng nào</td></tr>`;
      return;
  }

  orders.forEach((order, index) => {
      id_order[index] = order.id;
      let newRow = document.createElement("tr");
      let date = new Date(order.boughtDate);
      let formattedDate = date.toLocaleDateString('vi-VN');
      newRow.innerHTML = `
          <td>${order.id}</td>
          <td>${order.name}</td>
          <td>${formattedDate}</td>
          <td>${order.phone}</td>
          <td>${order.address}</td>
          <td class="details-action">
              <button onclick="checkBill(${index})">
                  <i class="fa-solid fa-x"></i>
              </button>
          </td>
          <td style="width:100px; text-align:center;">
              <a class="lnkSua lnkChiTiet" id="btnChiTiet${index}" 
                 data-id="${index}" data-trangthai="0" title="Xem chi tiết" 
                 href="#" onclick="handleDetailClick(event, ${index})">
                 Chi tiết
              </a>
          </td>
      `;
      orderTableBody.appendChild(newRow);

      // Tạo phần chi tiết đơn hàng (ẩn theo mặc định)
      const orderDetailsDiv = document.createElement('div');
      orderDetailsDiv.id = 'orderDetails' + index;
      orderDetailsDiv.style.display = 'none';
      // Hiển thị chi tiết sản phẩm trong đơn hàng
      const orderDetailsContent = document.createElement('div');
      orderDetailsContent.innerHTML = `
          <table class="order-detail-table">
              <thead>
                  <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Tổng</th>
                  </tr>
              </thead>
              <tbody>
                  ${order.boughtProducts.map(item =>{ 
                      var price = item.totalPrice; 
                      var money = price.replace(/[^\d]/g, "");
                      number = parseInt(money);
                      quantity = parseInt(item.quantity);
                      singlePrice =  number / quantity;
                      let singlePriceFormat = singlePrice.toLocaleString("vi-VN")+" VNĐ";
                      return `
                      <tr>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>${singlePriceFormat}</td>
                          <td>${price}</td>
                      </tr>
                  `}).join('')}
              </tbody>
          </table>
      `;
      orderDetailsDiv.appendChild(orderDetailsContent);
      // Thêm phần chi tiết vào bảng
      orderTableBody.appendChild(orderDetailsDiv);

      // Kiểm tra trạng thái đã duyệt và thay đổi biểu tượng
      const orderId = order.id;
      const orderIndex = checkedOrders.findIndex(o => o.id === orderId);

      if (orderIndex !== -1 && checkedOrders[orderIndex].mode === "pass") {
          const button = document.querySelector(`button[onclick="checkBill(${index})"]`);
          const icon = button.querySelector("i");
          if (icon) {
              icon.classList.remove("fa-x");
              icon.classList.add("fa-check"); // Đổi sang biểu tượng dấu check
          }
      }
  });
}

//Kiem tra thong tin thanh toan truoc khi submit from
function validatePayedByCard(){
  if (payedByCard > 0) {
    const tenInTrenThe = document.querySelector("#nameOnCard");
    const soThe = document.querySelector("#cardNumber");
    const ngaylapthe = document.querySelector("#dateCreated");
    if (!pattern.test(tenInTrenThe.value) || pattern.test(soThe.value)) {
      alert("Tên in trên thẻ phải là chữ hoặc số thẻ phải là số");
      return false;
    }
    const patternDate = /(0[1-9]|1[0-2])\/\d{2}/; // thang/name(2 ky tu)
    if(!patternDate.test(ngaylapthe.value)){
      alert("Ngày phát hành thẻ không hợp lệ");
      return false;
    }
  }else if(dathanhtoan === 0)
  {
    alert("Bạn chưa chọn phương thức thanh toán");
    return false;
  }
  const cartTable = document.querySelector("#cart");
  getUserBoughtPhones(cartTable);
  while (cartTable.rows.length > 1) {
    cartTable.deleteRow(1); // Xoá toàn bộ dữ liệu trong bảng giỏ hàng, trở về empty
  } 
  var duyetDonHang = JSON.parse(localStorage.getItem("checkedOrder"))||[];
  data.mode = "fail";
  duyetDonHang.push(data);
  localStorage.setItem("checkedOrder",JSON.stringify(duyetDonHang));
  document.querySelector("#frmdathang").style.display = "block";
  document.querySelector("#khung_dat_hang").style.display = "none";
  alert("Đơn hàng của bạn đã được gửi lên admin");
  document.querySelector("#readOrderHistory").style.display = "block";
  totalPrice = 0;
  document.querySelector("#frmthanhtoan").reset();
}
function checkOrderHistory() {
  if (sessionStorage.getItem("loggedInUser") === null) {
    document.querySelector("#readOrderHistory").style.display = "none";
    document.querySelector("#orderHistoryContainer").style.display = "none";
    document.querySelector("#empty").style.display = "flex";
    document.querySelector("#empty h1").textContent = "Bạn chưa mua sản phẩm của cửa hàng chúng tôi";
    document.querySelector("#empty #firstP").textContent = "Bạn hãy tiếp tục mua sắm.";
    document.querySelector("#empty #secondP").textContent = "Bạn sẽ tìm được chiếc điện thoại yêu thích của mình.";
  }else if (localStorage.getItem("checkedOrder")) {
    var checkedOrder = JSON.parse(localStorage.getItem("checkedOrder"));
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var ten = user.username;
    const orders = JSON.parse(localStorage.getItem("orders"));
    var flag = 0;
    orders.forEach(element => {
      if (element.name === ten) {    
        if (checkedOrder) {
          checkedOrder.forEach(check => {
            if(check.id === element.id){
              document.querySelector("#empty h1").textContent = "Chào Mừng Bạn Trờ Lại Cửa Hàng Chúng Tôi";
              document.querySelector("#empty #firstP").textContent = "Giỏ hàng của bạn đang trống";
              document.querySelector("#empty #secondP").textContent = "Chúng tui có nhiều điện thoại tuyệt vời dành cho bạn";
              // Khách hàng chỉ thấy nút xem lịch sử mua hàng khi đã tạo đơn hàng ít nhất 1 lần
              flag++;
            } 
          });
        }
      }
    })
    if (flag > 0) {
      displayOrderHistory();
    }
  } else {
    document.querySelector("#readOrderHistory").style.display = "none";
  }
}
document.querySelector("#frmthanhtoan").onsubmit = (event) =>{
  event.preventDefault();
  return validatePayedByCard();
}
checkOrderHistory();
// Nếu khách hàng xoá hết toàn bộ dòng trong giỏ hàng thì cho sang giao diện empty
const cartObserver = new MutationObserver(function () {
  if (document.querySelector("#cart").rows.length == 1) {
    document.querySelector("#non_empty").style.display = "none";
    document.querySelector("#empty").style.display = "flex";
  }
});

cartObserver.observe(document.querySelector("#cart"), { childList: true, subtree: true });