#!/bin/bash

# Dynamic Stock Analyzer - Deployment Script
# This script helps deploy the application using Docker Compose

set -e

echo "🚀 Dynamic Stock Analyzer - Deployment Script"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to check if services are running
check_services() {
    echo "📊 Checking service status..."
    if command -v docker-compose &> /dev/null; then
        docker-compose ps
    else
        docker compose ps
    fi
}

# Function to start services
start_services() {
    echo "🔄 Starting services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d
    else
        docker compose up -d
    fi
    echo "✅ Services started successfully!"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose down
    else
        docker compose down
    fi
    echo "✅ Services stopped successfully!"
}

# Function to view logs
view_logs() {
    echo "📋 Showing logs for all services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose logs -f
    else
        docker compose logs -f
    fi
}

# Function to rebuild services
rebuild_services() {
    echo "🔨 Rebuilding services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose build --no-cache
    else
        docker compose build --no-cache
    fi
    echo "✅ Services rebuilt successfully!"
}

# Function to run database migrations (if needed)
run_migrations() {
    echo "🗄️  Running database migrations..."
    # Add migration commands here if using a migration tool
    echo "✅ Database migrations completed!"
}

# Main menu
while true; do
    echo ""
    echo "Choose an option:"
    echo "1) Check service status"
    echo "2) Start services"
    echo "3) Stop services"
    echo "4) View logs"
    echo "5) Rebuild services"
    echo "6) Run database migrations"
    echo "7) Full deployment (rebuild + start)"
    echo "8) Exit"
    echo ""

    read -p "Enter your choice (1-8): " choice

    case $choice in
        1)
            check_services
            ;;
        2)
            start_services
            ;;
        3)
            stop_services
            ;;
        4)
            view_logs
            ;;
        5)
            rebuild_services
            ;;
        6)
            run_migrations
            ;;
        7)
            echo "🚀 Performing full deployment..."
            stop_services
            rebuild_services
            start_services
            echo "🎉 Full deployment completed!"
            ;;
        8)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-8."
            ;;
    esac
done
