"use client";

import { Component, ReactNode } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoAlertCircleOutline className="w-10 h-10 text-amber-400" />
            </div>

            <h1 className="text-2xl font-light text-slate-800 mb-3">
              Что-то пошло не так
            </h1>

            <p className="text-slate-500 mb-8 leading-relaxed">
              {this.state.error?.message || "Произошла непредвиденная ошибка. Мы уже работаем над её исправлением."}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors duration-300 shadow-sm"
              >
                <LuRefreshCw size={18} />
                <span>Перезагрузить страницу</span>
              </button>

              <p className="text-sm text-slate-400">
                Если ошибка повторяется, пожалуйста,{' '}
                <button
                  onClick={() => window.location.href = "mailto:mirnyjj94@mail.ru"}
                  className="text-slate-600 hover:text-slate-800 underline underline-offset-2 transition-colors"
                >
                  свяжитесь с поддержкой
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}