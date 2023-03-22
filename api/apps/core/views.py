class RelativeHyperlinkedModelViewSetMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = None
        return context
