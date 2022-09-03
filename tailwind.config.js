module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                "primary": "var(--primary)",
                "on-primary": "var(--on-primary)",
                "secondary": "var(--secondary)"
            }
        },
    },
    plugins: [],
}