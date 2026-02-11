import os
import sys
import subprocess
from pathlib import Path
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Crea venv (venv), instala requirements, ejecuta makemigrations y migrate. Inicia runserver por defecto.'

    def add_arguments(self, parser):
        parser.add_argument('-r', '--requirements', default='requirements.txt', help='Ruta al archivo requirements (relativa a backend/)')
        parser.add_argument('--venv-name', default='venv', help='Nombre del directorio del venv (default: venv)')
        parser.add_argument('--no-runserver', action='store_true', help='No iniciar runserver al final')

    def handle(self, *args, **options):
        req_path = options['requirements']
        venv_name = options['venv_name']
        runserver = not options['no_runserver']

        # backend_dir = <repo>/backend
        commands_dir = Path(__file__).resolve()
        backend_dir = commands_dir.parents[3]

        self.stdout.write(self.style.NOTICE(f'Backend directory: {backend_dir}'))

        venv_dir = backend_dir / venv_name

        # Create venv if not exists
        if not venv_dir.exists():
            self.stdout.write(self.style.NOTICE(f'Creating virtual environment at: {venv_dir}'))
            subprocess.check_call([sys.executable, '-m', 'venv', str(venv_dir)])
        else:
            self.stdout.write(self.style.NOTICE(f'Virtual environment already exists at: {venv_dir}'))

        # Determine python executable inside venv
        if os.name == 'nt':
            venv_python = venv_dir / 'Scripts' / 'python.exe'
        else:
            venv_python = venv_dir / 'bin' / 'python'

        if not venv_python.exists():
            self.stderr.write('ERROR: python executable not found inside venv. Aborting.')
            return

        # Resolve requirements path
        req_file = Path(req_path)
        if not req_file.is_absolute():
            req_file = backend_dir / req_file

        if not req_file.exists():
            self.stderr.write(self.style.ERROR(f'Requirements file not found: {req_file}'))
            return

        # Upgrade pip and install requirements into venv
        self.stdout.write(self.style.NOTICE('Upgrading pip in virtualenv...'))
        subprocess.check_call([str(venv_python), '-m', 'pip', 'install', '--upgrade', 'pip'])

        self.stdout.write(self.style.NOTICE(f'Installing requirements from {req_file}...'))
        subprocess.check_call([str(venv_python), '-m', 'pip', 'install', '-r', str(req_file)])

        # Run makemigrations and migrate using venv python to ensure correct environment
        manage_py = backend_dir / 'manage.py'
        if not manage_py.exists():
            # fallback to parent if structure differs
            manage_py = backend_dir.parent / 'manage.py'

        if not manage_py.exists():
            self.stderr.write(self.style.ERROR('manage.py not found. Aborting migrations.'))
            return

        self.stdout.write(self.style.NOTICE('Running makemigrations...'))
        subprocess.check_call([str(venv_python), str(manage_py), 'makemigrations'])

        self.stdout.write(self.style.NOTICE('Running migrate...'))
        subprocess.check_call([str(venv_python), str(manage_py), 'migrate'])

        self.stdout.write(self.style.SUCCESS('Setup complete.'))

        if runserver:
            self.stdout.write(self.style.NOTICE('Starting development server (0.0.0.0:8000) using venv python...'))
            subprocess.check_call([str(venv_python), str(manage_py), 'runserver', '0.0.0.0:8000'])
