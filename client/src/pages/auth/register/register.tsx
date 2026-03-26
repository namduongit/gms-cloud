import { type ChangeEvent, type FormEvent, useState } from "react";

const inputClasses =
	"mt-2 w-full rounded-xl border border-[#c6c0b3] bg-white px-4 py-3 text-sm text-[#2d2a26] placeholder:text-[#9c9688] transition focus:border-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#94815e]/25";

type Status = {
	type: "idle" | "success" | "error";
	message: string;
};

const RegisterPage = () => {
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setStatus({ type: "idle", message: "" });
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!form.email || !form.password || !form.confirmPassword) {
			setStatus({ type: "error", message: "Vui lòng điền đủ thông tin." });
			return;
		}

		if (form.password !== form.confirmPassword) {
			setStatus({ type: "error", message: "Mật khẩu xác nhận không khớp." });
			return;
		}

		setStatus({ type: "success", message: "Tuyệt vời! Tài khoản đã sẵn sàng được tạo." });
	};

	return (
		<div className="min-h-screen bg-[#fbf8f1] px-4 py-8">
			<div className="mx-auto grid max-w-5xl gap-10 rounded-4xl border border-[#dfd9cb] bg-white/95 p-10 shadow-[0_30px_120px_rgba(25,22,18,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
				<section className="space-y-8">
					<p className="text-sm uppercase tracking-[0.4em] text-[#947c52]">Tạo tài khoản</p>
					<h1 className="text-4xl font-serif text-[#2d2a26]">Tham gia hệ thống quản lý liên kết</h1>
					<p className="text-sm leading-relaxed text-[#4d493f]">
						Phù hợp cho marketer, agency hoặc doanh nghiệp cần quản lý đường dẫn chuẩn mực và
						nhất quán. Chúng tôi giữ phong cách cổ điển, tập trung vào trải nghiệm cơ bản nhưng
						chỉn chu.
					</p>

					<div className="space-y-5">
						{["Khởi tạo thương hiệu", "Phân quyền nhóm", "Giám sát và thống kê"].map((item, index) => (
							<div key={item} className="flex items-start gap-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5cec0] bg-[#f7f3ea] text-sm font-semibold text-[#7c6540]">
									{index + 1}
								</div>
								<div>
									<p className="font-semibold text-[#2d2a26]">{item}</p>
									<p className="text-sm text-[#4d493f]">
										{index === 0 && "Định nghĩa chuẩn thương hiệu trên mỗi liên kết."}
										{index === 1 && "Cấu hình quyền truy cập rõ ràng cho từng vai trò."}
										{index === 2 && "Theo dõi lượt click và tỷ lệ chuyển đổi ngay lập tức."}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-[28px] border border-[#dcd6c6] bg-[#f6f2e9] p-8">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label className="text-sm font-semibold text-[#2d2a26]" htmlFor="email">
								Email công việc
							</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="name@company.com"
								className={inputClasses}
								value={form.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-semibold text-[#2d2a26]" htmlFor="password">
								Mật khẩu
							</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Tối thiểu 8 ký tự"
								className={inputClasses}
								value={form.password}
								onChange={handleChange}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-semibold text-[#2d2a26]" htmlFor="confirmPassword">
								Xác nhận mật khẩu
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Nhập lại mật khẩu"
								className={inputClasses}
								value={form.confirmPassword}
								onChange={handleChange}
								required
							/>
						</div>

						<p className="text-xs leading-relaxed text-[#5c574b]">
							Khi tạo tài khoản, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật. Chúng tôi giữ dữ
							liệu tối giản, chỉ phục vụ cho việc phân tích hiệu quả liên kết.
						</p>

						<button
							type="submit"
							className="w-full rounded-2xl bg-[#2d2a26] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#1c1915]"
						>
							Tạo tài khoản
						</button>

						<p className="text-center text-sm text-[#4d493f]">
							Đã có tài khoản? <a className="font-semibold text-[#7c6540] hover:underline" href="/auth/login">Đăng nhập</a>
						</p>

						{status.message && (
							<p
								className={`text-center text-sm ${
									status.type === "error" ? "text-[#a04b3b]" : "text-[#7c6540]"
								}`}
								aria-live="polite"
							>
								{status.message}
							</p>
						)}
					</form>
				</section>
			</div>
		</div>
	);
};

export default RegisterPage;
