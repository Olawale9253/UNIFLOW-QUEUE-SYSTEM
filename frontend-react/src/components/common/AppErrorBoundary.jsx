import React from 'react';
import ErrorState from './ErrorState';

class AppErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
                    <div className="mx-auto max-w-2xl">
                        <ErrorState
                            title="This page could not be displayed"
                            message="An unexpected error interrupted the page. Try again, or reload the page if the problem continues."
                            onRetry={this.handleRetry}
                        />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;