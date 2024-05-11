import os
from backend.app import create_app

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

print("-----------------------------------------------")
print("Current Environment Configuration:")
for key, value in app.config.items():
    print(f"{key}: {value}")
print("---------------------------------------------")


if __name__ == '__main__':
    app.run(port=5000, debug=True)

