const MainPage = () => {
	return (
		<div className="min-h-screen bg-[#f7f4ed] px-6 py-12">
			<div className="mx-auto max-w-4xl rounded-3xl border border-[#ded7c7] bg-white/95 p-10 shadow-lg">
				<p className="text-sm uppercase tracking-[0.35em] text-[#947c52]">Bảng điều khiển</p>
				<h1 className="mt-3 text-4xl font-serif text-[#2d2a26]">Xin chào!</h1>
				<p className="mt-4 text-[#4d493f]">
					Đây là trang được bảo vệ. Bạn chỉ thấy nội dung này khi phiên đăng nhập còn hiệu lực.
				</p>
			</div>
		</div>
	);
}

export default MainPage;
