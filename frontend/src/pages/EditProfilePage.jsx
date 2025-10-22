import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  // State để lưu trữ danh sách người dùng
  const [users, setUsers] = useState([]);
  // State để lưu trữ trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(true); 
  
  const navigate = useNavigate();

  // Lấy token và thông tin người dùng từ Local Storage
  const token = localStorage.getItem("token");
  // Đảm bảo user được parse thành object, hoặc null nếu không có
  const user = token ? JSON.parse(localStorage.getItem("user")) : null; 

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Sửa lỗi cú pháp template literal: dùng dấu backtick (`) và ${}
      const res = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Đã sửa lỗi cú pháp tại đây
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      // Xử lý các lỗi phổ biến (ví dụ: token hết hạn)
      if (err.response && err.response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
        handleLogout();
      } else {
        alert("Không thể tải danh sách người dùng!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra quyền và tải danh sách khi component được mount
  useEffect(() => {
    // 1. Kiểm tra token có tồn tại và user có role là Admin
    if (!token || user?.role !== "Admin") {
      alert("Bạn không có quyền truy cập trang Quản trị viên!");
      navigate("/login");
    } else {
      // 2. Nếu đủ quyền, tiến hành tải dữ liệu
      fetchUsers();
    }
  }, [token, user?.role, navigate]); // Thêm dependencies

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Nếu không phải admin, không render gì thêm (hoặc chỉ một thông báo đơn giản)
  if (!token || user?.role !== "Admin") {
    return null; // Component sẽ chuyển hướng trong useEffect
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          📋 Danh sách người dùng
        </h2>
        
        {/* Hiển thị trạng thái tải */}
        {isLoading ? (
            <p className="text-blue-500 mt-3">Đang tải dữ liệu...</p>
        ) : (
            // Hiển thị danh sách sau khi tải xong
            users.length > 0 ? (
                <ul className="text-left space-y-2">
                    {users.map((u) => (
                        <li key={u._id} className="flex items-center gap-2 border-b pb-1">
                            <span>👤</span>
                            <span className="font-semibold">{u.name}</span>
                            <span className="text-gray-600">— {u.email}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 mt-3">Không có người dùng nào.</p>
            )
        )}
        
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Admin;