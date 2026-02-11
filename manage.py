#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available on your PYTHONPATH?"
        ) from exc

    # Shortcut: allow calling python manage.py -r requirements.txt to run setupenv
    if len(sys.argv) > 1 and (sys.argv[1] == '-r' or sys.argv[1] == '--requirements'):
        sys.argv.insert(1, 'setupenv')

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()