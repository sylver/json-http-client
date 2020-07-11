#!make

PRERELEASE_TAG ?= beta

PM = npm
RM = rm -rf

PUBLISH_FLAGS = publish --access public

MODULES = node_modules
DIST = dist
COVERAGE = .nyc_output coverage

.PHONY: all
all: clean $(DIST)

$(MODULES):
	$(PM) i

$(DIST): $(MODULES)
	$(PM) run build

.PHONY: clean
clean:
	$(RM) $(DIST) $(COVERAGE)

.PHONY: clean-all
clean-all:
	$(RM) $(MODULES)

.PHONY: test
test:
	$(PM) t

coverage:
	$(PM) run coverage

.PHONY: release
release: $(DIST)
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+$(PM) run release -- --dry-run
	+$(PM) $(PUBLISH_FLAGS) --dry-run
else
	$(PM) run release
	git push --follow-tags origin master
	$(PM) $(PUBLISH_FLAGS)
endif

.PHONY: prerelease
prerelease: $(DIST)
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+$(PM) run release -- --prerelease $(PRERELEASE_TAG) --dry-run
	+$(PM) $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG) --dry-run
else
	$(PM) run release -- --prerelease $(PRERELEASE_TAG)
	git push --follow-tags origin master
	$(PM) $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG)
endif
