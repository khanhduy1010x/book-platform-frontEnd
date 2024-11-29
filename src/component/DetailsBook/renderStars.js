function renderStars(rating) {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 
  
    return (
      <div className="flex items-center">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`full-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FFCC00"
            >
              <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            </svg>
          ))}
        {halfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#FFCC00"
          >
            <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            <path
              d="M12 .587L8.332 8.016 0 9.748l6 5.847-1.417 8.266L12 18.896V.587z"
              fill="#E0E0E0"
            />
          </svg>
        )}
        {/* Hiển thị các sao trống */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#E0E0E0"
            >
              <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            </svg>
          ))}
      </div>
    );
  }
  